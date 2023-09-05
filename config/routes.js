import { Router } from "express";
import { body, param } from "express-validator";
import ActivitiesController from "../controllers/ActivitiesController.js";

const routes = Router({ strict: true });

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

export default routes;
