import personModel from "../models/person.model"

export interface ICreatePersonParams {
  name: string;
  designation: string;
  description?: string;
  image: { url: string };
}

export class PersonRepository {
  private _model = personModel;

  async getAllPersons() {
    return this._model.find();
  }

  async getPersonById(personId: string) {
    return this._model.findById(personId);
  }

  async createPerson(params: ICreatePersonParams) {
    return this._model.create(params);
  }

  async updatePerson(personId: string, updateData: Partial<ICreatePersonParams>) {
    return this._model.findByIdAndUpdate(personId, updateData, { new: true });
  }

  async deletePerson(personId: string) {
    return this._model.findByIdAndDelete(personId);
  }
}
