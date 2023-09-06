import { Router } from "express";
import { body, param } from "express-validator";
import ActivitiesController from "../controllers/ActivitiesController.js";
import TodosController from "../controllers/TodosController.js";

const routes = Router({ strict: true });

routes.get("/", (req, res) => {
  res.json({ message: "Welcome!" });
});

routes.post(
  "/activity-groups",
  [
    body("title", "Cannot be blank").trim().not().isEmpty().escape(),
    body("email", "Cannot be blank").trim().not().isEmpty().escape()
  ],
  ActivitiesController.validation,
  ActivitiesController.create
);
routes.get("/activity-groups", ActivitiesController.getAll);
routes.get(
  "/activity-groups/:id",
  [
    param("id", "Invalid activity ID").exists().isNumeric().toInt()
  ],
  ActivitiesController.validation,
  ActivitiesController.getOne
);
routes.patch(
  "/activity-groups/:id",
  [
    param("id", "Invalid activity ID").exists().isNumeric().toInt(),
    body("title", "Cannot be blank").optional().trim().not().isEmpty().escape(),
    body("email", "Cannot be blank").optional().trim().not().isEmpty().escape()
  ],
  ActivitiesController.validation,
  ActivitiesController.update
);
routes.delete(
  "/activity-groups/:id",
  [
    param("id", "Invalid activity ID").exists().isNumeric().toInt()
  ],
  ActivitiesController.validation,
  ActivitiesController.delete
);

routes.post(
  "/todo-items",
  [
    body("activity_group_id", "Cannot be blank").exists().isNumeric().toInt(),
    body("title", "Cannot be blank").trim().not().isEmpty().escape(),
    body("priority", "Cannot be blank").trim().not().isEmpty().escape()
  ],
  TodosController.validation,
  TodosController.create
);
routes.get("/todo-items", TodosController.getAll);
routes.get(
  "/todo-items/:id",
  [
    param("id", "Invalid todo ID").exists().isNumeric().toInt()
  ],
  TodosController.validation,
  TodosController.getOne
);
routes.patch(
  "/todo-items/:id",
  [
    param("id", "Invalid todo ID").exists().isNumeric().toInt(),
    body("activity_group_id", "Cannot be blank").exists().isNumeric().toInt(),
    body("title", "Cannot be blank").optional().trim().not().isEmpty().escape(),
    body("priority", "Cannot be blank").optional().trim().not().isEmpty().escape()
  ],
  TodosController.validation,
  TodosController.update
);
routes.delete(
  "/todo-items/:id",
  [
    param("id", "Invalid todo ID").exists().isNumeric().toInt()
  ],
  TodosController.validation,
  TodosController.delete
);

export default routes;
