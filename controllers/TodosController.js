import { validationResult, matchedData } from "express-validator";
import moment from "moment";
import db from "../config/database.js";

const validation_result = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const set_todo = async (id) => {
  try {
    return await db.execute(`SELECT * FROM todos WHERE id=${id}`);
  } catch (error) {
    console.log(error);
  }
};

class TodosController {

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
    const { activity_group_id, title, priority } = matchedData(req);

    try {
      const [result] = await db.execute(
        "INSERT INTO `todos` (`activity_group_id`, `title`, `priority`) VALUES (?, ?, ?)",
        [activity_group_id, title, priority]
      );
      const todo = await set_todo(result.insertId);

      res.status(201).json({
        status: "Success",
        message: "Data saved successfully",
        data: todo[0]
      });
    } catch (error) {
      next(error);
    }
  };

  static getAll = async (req, res, next) => {
    try {
      const [todos] = await db.query("SELECT * FROM todos");

      res.status(200).json({
        status: "Success",
        message: "Success",
        data: todos,
      });
    } catch (error) {
      next(error);
    }
  };

  static getOne = async (req, res, next) => {
    const id = req.params.id;

    try {
      const [todo] = await db.query(`SELECT * FROM todos WHERE id=${id}`);

      if (todo.length === 0 && id) {
        return res.status(404).json({
          status: "Not Found",
          message: `Todo with ID ${id} Not Found`
        });
      }

      res.status(200).json({
        status: "Success",
        message: "Success",
        data: todo[0],
      });
    } catch (error) {
      next(error);
    }
  };

  static update = async (req, res, next) => {
    try {
      const id   = req.params.id;
      const data = matchedData(req);
      const [todos] = await db.query("SELECT * FROM `todos` WHERE `id`=?", [id]);

      if (todos.length !== 1) {
        return res.status(404).json({
          status: "Not Found",
          message: `Todo with ID ${id} Not Found`   
        })
      }

      const todo              = todos[0];
      const date              = moment().format('YYYY-MM-DD hh:mm:ss')
      const activity_group_id = data.activity_group_id || todo.activity_group_id;
      const title             = data.title || todo.title;
      const priority          = data.priority || todo.priority;

      const result = await db.execute(
        "UPDATE `todos` SET `activity_group_id`=?, `title`=?, `priority`=?, `updated_at`=? WHERE `id`=?",
        [activity_group_id, title, priority, date, id]
      );
      const updated_value = await set_todo(id);

      res.status(200).json({
        status: "Success",
        message: "Todo updated successfully",
        data: updated_value[0]
      });
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req, res, next) => {
    try {
      const id = req.params.id;

      const [ result ] = await db.execute(
        "DELETE FROM `todos` WHERE `id`=?",
        [id]
      );

      if (result.affectedRows) {
        return res.status(200).json({
          status: "Success",
          message: "Success",
          data: {},
      });
      }

      return res.status(404).json({
        status: "Not Found",
        message: `Todo with ID ${id} Not Found`   
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TodosController;