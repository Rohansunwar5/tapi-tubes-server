// controllers/person.controller.ts
import { NextFunction, Request, Response } from "express";
import personService from "../services/person.service";

interface MulterFiles {
  image?: Express.Multer.File;
}

export const getAllPersons = async (req: Request, res: Response, next: NextFunction) => {
  const response = await personService.getAllPersons();
  next(response);
};

export const getAPerson = async (req: Request, res: Response, next: NextFunction) => {
  const { personId } = req.params;
  const response = await personService.getPersonById(personId);
  next(response);
};

export const createAPerson = async (req: Request, res: Response, next: NextFunction) => {
  const { name, designation, description } = req.body;
  const image = req.file as Express.Multer.File;

  const response = await personService.createPerson({
    name,
    designation,
    description,
    image,
  });
  next(response);
};

export const editAPerson = async (req: Request, res: Response, next: NextFunction) => {
  const { personId } = req.params;
  const { name, designation, description } = req.body;
  const image = req.file as Express.Multer.File;

  const response = await personService.editPerson({
    personId,
    name,
    designation,
    description,
    image,
  });
  next(response);
};


export const deleteAPerson = async (req: Request, res: Response, next: NextFunction) => {
  const { personId } = req.params;
  const response = await personService.deletePerson(personId);
  next(response);
};