export const schemaExample = `
@public
collection NewUsers {
  id: string;
  publicKey: PublicKey;
  name: string; 
  age: number; 

  constructor (id: string) {
    this.id = id;
    this.publicKey = ctx.publicKey;
  }

  function setAge (age: number) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.age = age;
  }
}`