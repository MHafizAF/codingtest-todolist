import { validationResult, matchedData } from "express-validator";
import moment from "moment";
import db from "../config/database.js";

const validation_result = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

class ActivitiesController {

  static validation = (req, res, next) => {
    const errors = validation_result(req).mapped();

    if (Object.keys(errors).length) {
      return res.status(400).json({
        status: "Bad Request",
        message: errors,
      });
    }

    next();
  };

  static create = async (req, res, next) => {
    const { title, email } = matchedData(req);

    try {
      const [result] = await db.execute(
        "INSERT INTO `activities` (`title`, `email`) VALUES (?, ?)",
        [title, email]
      );

      res.status(201).json({
        status: "Success",
        message: "Data saved successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (req, res, next) => {
    try {
      const [activities] = await db.query("SELECT * FROM activities");

      res.status(200).json({
        status: "Success",
        message: "Success",
        data: activities,
      });
    } catch (error) {
      next(error);
    }
  };

  static getOne = async (req, res, next) => {
    const id = req.params.id;

    try {
      const [activity] = await db.query(`SELECT * FROM activities WHERE id=${id}`);

      if (activity.length === 0 && id) {
        return res.status(404).json({
          status: "Not Found",
          message: `Activity with ID ${id} Not Found`
        });
      }

      res.status(200).json({
        status: "Success",
        message: "Success",
        data: activity[0],
      });
    } catch (error) {
      next(error);
    }
  };

  static update = async (req, res, next) => {
    try {
      const id   = req.params.id;
      const data = matchedData(req);
      const [activities] = await db.query("SELECT * FROM `activities` WHERE `id`=?", [id]);

      if (activities.length !== 1) {
        return res.status(404).json({
          status: "Not Found",
          message: `Activity with ID ${id} Not Found`   
        })
      }

      const activity = activities[0];
      const date     = moment().format('YYYY-MM-DD hh:mm:ss')
      const title    = data.title || activity.title;
      const email    = data.email || activity.email;

      const result = await db.execute(
        "UPDATE `activities` SET `title`=?, `email`=?, `updated_at`=? WHERE `id`=?",
        [title, email, date, id]
      );

      res.status(200).json({
        status: "Success",
        message: "Activities updated successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req, res, next) => {
    try {
      const id = req.params.id;

      const [ result ] = await db.execute(
        "DELETE FROM `activities` WHERE `id`=?",
        [id]
      );

      if (result.affectedRows) {
        res.status(200).json({
          status: "Success",
          message: "Success",
          data: {},
      });
      }

      return res.status(404).json({
        status: "Not Found",
        message: `Activity with ID ${id} Not Found`   
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ActivitiesController;
