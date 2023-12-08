export class Contact {
    name: string;
    numberOfPeople: number;
    dateAndTime: string;
    message: string
  
    constructor(name: string,numberOfPeople: number,dateAndTime: string, message: string) {
      this.name = name;
      this.numberOfPeople = numberOfPeople;
      this.dateAndTime = dateAndTime;
      this.message = message;
    }
  }