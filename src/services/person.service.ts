import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { PersonRepository } from "../repository/person.repository";
import { uploadToCloudinary } from "../utils/cloudinary.util";

interface CreatePersonParams {
  name: string;
  designation: string;
  description?: string;
  image?: Express.Multer.File;
}

interface EditPersonParams {
  personId: string;
  name?: string;
  designation?: string;
  description?: string;
  image?: Express.Multer.File;
}

class PersonService {
  constructor(private readonly _personRepository: PersonRepository) {}

  private async handleImageUpload(file: Express.Multer.File): Promise<{ url: string }> {
    const uploadResult = await uploadToCloudinary(file);
    return { url: uploadResult };
  }

  async getAllPersons() {
    const persons = await this._personRepository.getAllPersons();
    if (!persons || persons.length === 0) throw new NotFoundError("No persons found");
    return persons;
  }

  async getPersonById(personId: string) {
    const person = await this._personRepository.getPersonById(personId);
    if (!person) throw new NotFoundError("Person not found");
    return person;
  }

  async createPerson(params: CreatePersonParams) {
    const { name, designation, description, image } = params;

    if (!image) throw new BadRequestError("Image is required");

    const imageUrl = await this.handleImageUpload(image);

    const personData = {
      name,
      designation,
      description,
      image: imageUrl,
    };

    const createdPerson = await this._personRepository.createPerson(personData);

    if (!createdPerson) throw new InternalServerError("Person creation failed");

    return createdPerson;
  }


  async editPerson(params: EditPersonParams) {
    const { personId, name, designation, description, image } = params;
    const existingPerson = await this._personRepository.getPersonById(personId);
    if (!existingPerson) throw new NotFoundError("Person not found");
    let imageUrl = existingPerson.image;
    if (image) {
      imageUrl = await this.handleImageUpload(image);
    }
    const updateData: any = { image: imageUrl };
    if (name) updateData.name = name;
    if (designation) updateData.designation = designation;
    if (description) updateData.description = description;
    const updatedPerson = await this._personRepository.updatePerson(personId, updateData);
    if (!updatedPerson) throw new InternalServerError("Person update failed");
    return updatedPerson;
  }

  async deletePerson(personId: string) {
    const existingPerson = await this._personRepository.getPersonById(personId);
    if (!existingPerson) throw new NotFoundError("Person not found");

    const deletedPerson = await this._personRepository.deletePerson(personId);
    if (!deletedPerson) throw new InternalServerError("Person deletion failed");

    return { message: "Person deleted successfully", deletedPerson };
  }
  
}

export default new PersonService(new PersonRepository());