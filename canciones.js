var express = require('express');
var router = express.Router(); 
var path = require('path');
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://sylenib:pajaroazul5@vanguardia.dfabwyn.mongodb.net/Vanguardia?retryWrites=true&w=majority"
  )
  .catch((error) => console.error(error));

  const MusicSchema = new mongoose.Schema(
    {
      id: mongoose.Types.ObjectId,
      songs: String,
      artist: String,
      year: Number,
      album: String,
      country: String,
    },
    {
      collection: "musica", 
    }
  );

const Music = mongoose.model("musica", MusicSchema);


router.get("/canciones", function (req, res) {
    res.sendFile(path.join(__dirname,'public/canciones.html'));
  });  

router.get("/api/canciones/musica", (req, res) => {
  Music.find ((err, music) => {
    if (err) res.status(500).send("Error en la base de datos.");
    else res.status(200).json(music);
  });
});

//Music Online
router.post("/api/canciones/musica", function (req, res) {

    const songs1 = new Music({
      artist: req.body.artist,
      songs: req.body.songs,
      country: req.body.country,
      year: req.body.year,
      album: req.body.album,
    });

     //Guardar una canción en la base de datos
 songs1.save(function (error, songs1) { 
  if (error) {
    res.status(500).send("No se ha podido agregar.");
  } else {
    res.status(200).json(songs1);
  }
});
});

 //Consultar por nombre del artista
  router.get("/api/canciones/musica/artist/:artist", function (req, res) {
     Music.find({artist:req.params.artist},  function (err, Music) {
      if (err) res.status(500).send(" datos");
      else {
        if (Music != null) {
          res.status(200).json(Music);
        } else res.status(404).send("No se encontro nada");
      }
    });
  });

  //Consultar por año X o más reciente

  router.get("/api/canciones/musica/year/:year", function (req, res) {
    Music.find({ year: { $gte: req.params.year } }, function (err, Music) {
      if (err) {
        console.log(err);
        res.status(500).send("Error al leer de la base de datos");
      } else res.status(200).json(Music);
    });
  });

  //Consultar entre dos años (desde – hasta)

  router.get("/api/canciones/musica/betweenyear/", function (req, res) {
    Music.find({ $and: [ { year: { $gte: req.query.from } }, { year: { $lte: req.query.to } }, ], }, function (err, Music) {
      if (err) {
        console.log(err);
        res.status(500).send("Error en la base de datos");
      } else res.status(200).json(Music);
    });
  });
  
    //Consultar por ID

  router.get("/api/canciones/musica/:id", function (req, res) {
    Music.findById(req.params.id, function (err, Music) {
      if (err) res.status(500).send("Er");
      else {
        if (Music != null) {
          res.status(200).json(Music);
        } else res.status(404).send("No se encontro nada");
      }
    });
  });


  //Modificar
  router.put("/api/canciones/musica/:id", function (req, res) {
  
    Music.findById(req.params.id, function (err, Music) {
      if (err) response.status(500).send("Error");
      else {
        if (Music != null) {
          Music.artist = req.body.artist;
          Music.country = req.body.country;
          Music.songs = req.body.songs;
          Music.year = req.body.year;
          Music.album = req.body.album;
  
          Music.save(function (error, songs1) {
            if (error) res.status(500).send("Error");
            else {
              res.status(200).send("¡Modificado!");
            }
          });
        } else res.status(404).send("No se encontro nada.");
      }
      
    });
  });

  //Eliminar 
  
  router.delete("/api/canciones/musica/:id", function (req, res) {
    Music.findById(req.params.id, function (err, Music) {
      if (err) res.status(500).send("Error al leer de la base de datos");
      else {
        if (Music != null) {
          Music.remove(function (error, result) {
            if (error) res.status(500).send("Error en la base de datos");
            else {
              res.status(200).send("¡Eliminado!");
            }
          });
        } else res.status(404).send("No se encontró nada");
      }
    });
  });

  module.exports = router;