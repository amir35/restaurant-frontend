export class Image {
    id: number;
    name: string;
    type: string;
    picByte: Uint8Array;
  
    constructor(id: number, name: string, type: string, picByte: Uint8Array) {
      this.id = id;
      this.name = name;
      this.type = type;
      this.picByte = picByte;
    }
  }