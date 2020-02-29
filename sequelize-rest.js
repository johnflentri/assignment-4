const Sequelize = require("sequelize")
const express = require("express")
const bodyParser = require("body-parser");
const app = express()
const jsonParser = bodyParser.json()
const port = 3000
const databaseUrl = 'postgres://postgres:secret@localhost:5432/postgres'
const db = new Sequelize(databaseUrl)

app.use(jsonParser)

const Movie = db.define('movie', {
  title: Sequelize.STRING,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.STRING
});

db.sync()
  .then(() => console.log('Database schema has been updated'))
  .catch(err => {
    console.error("Something went wrong", err)
  })

app.post("/movie", (req, res, next) => {
  Movie.create(req.body)
    .then(movie => res.json(movie))
    .catch(next)
})

// app.get("/movie", (req, res, next) => {
//   Movie.findAll()
//     .then(movie => {
//       res.json(movie)
//     })
//     .catch(next)
// })

app.get("/movie", (req, res, next) => {
  const limit = Math.min(req.query.limit || 10, 100)
  const offset = req.query.offset || 0
  Movie.findAndCountAll({ limit, offset })
    .then(result => res.send({ movies: result.rows, total: result.count }))
    .catch(error => next(error))
})

app.get("/movie/:movieId", (req, res, next) => {
  Movie.findByPk(req.params.movieId)
    .then(movie => {
      if (!movie) {
        res.status(404).end()
      } else {
        res.json(movie)
      }
    })
})

app.put("/movie/:movieId", (req, res, next) => {
  Movie.findByPk(req.params.movieId)
    .then(movie => {
      if (!movie) {
        res.status(404).end()
      } else {
        return movie.update(req.body)
          .then(movie => { res.json(movie) })
      }
    })
})

app.delete("/movie/:movieId", (req, res, next) => {
  Movie.findByPk(req.params.movieId)
    .then(movie => {
      if (!movie) {
        res.status(404).end()
      } else {
        return movie.destroy(req.body)
      }
    })
})

app.listen(port, () => console.log("Listening on port :", port))
