import bodyParser from 'body-parser';
import express from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';

(async () => {
  //Create an express application
  const app = express(); 
  //default port to listen
  const port = 8080; 
  
  //use middleware so post bodies 
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json()); 
  app.use(express.urlencoded({ extended: true })) //for requests from forms-like data

  // Root URI call
  app.get( "/", ( req, res ) => {
    res.status(200).send("try GET /filteredimage?image_url={{}}");
  } );

  app.get( "/filteredimage", async ( req, res ) => {
    const imageUrl = req.query.image_url;
    if (!imageUrl) {
      return res.status(400).send("Image URL is required.");
    }

    try {
      const filteredImagePath = await filterImageFromURL(imageUrl);
      console.log(filteredImagePath);
      res.status(200).sendFile(filteredImagePath, () => {
        deleteLocalFiles([filteredImagePath]);
      });
    } catch (error) {
      console.error(error);
      return res.status(422).send("Unable to process the image.");
    }
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
