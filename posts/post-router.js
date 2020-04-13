const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", (req, res) => {
  db.select("*")
    .from("posts")
    .then((posts) => {
      res.status(200).json({ data: posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get("/:id", (req, res) => {
  db("posts")
    .where("id", req.params.id)
    .first()
    .then((posts) => {
      res.status(200).json({ data: posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.post("/", (req, res) => {
  const postData = req.body;
  db("posts")
    .insert(postData, "id")
    .then((ids) => {
      const id = ids[0];
      db("posts")
        .where({ id })
        .first()
        .then((post) => {
          res.status(200).json({ data: post });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.patch("/:id", (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  db("posts")
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count) {
        res.status(200).json({ message: "update successful" });
      } else {
        res.status(404).json({ message: "no posts by that id" });
      }
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db("posts")
    .where({ id })
    .del()
    .then((count) => {
      if (count) {
        res.status(200).json({ message: "successfully deleted" });
      } else {
        res.status(404).json({ message: "invalid id, cannot delete" });
      }
    });
});

module.exports = router;
