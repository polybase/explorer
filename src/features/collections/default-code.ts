export const DEFAULT_CODE = (name: string) => `// This is a default collection deployed using the explorer.
// You should edit these collection rules for your use case.

// The language is very similar to JavaScript, but keep in
// mind that semi-colons are mandatory!

collection ${name} {
  // id is required on all collections
  // id MUST be unique
  id: string;

  // Add a public key of the owner
  // of the record, we can then use this 
  // public key to implement permissions
  publicKey: string;

  // An optional property denoted with ?
  name?: string; 

  // Constructor is called when a new record is
  // created, make sure to assign a value to this.id
  constructor (id: string) {
    // this.id MUST be assigned in the constructor 
    // this.id MUST be unique
    this.id = id;
    
    // You can assign the publicKey of the user who is
    // creating the record, this can then be used to
    // control permissions for the record (see below)
    this.publicKey = ctx.publicKey;
  }


  // You can add your own functions to determine rules
  // on who can update the records data
  function setName (name: string) {
    if (ctx.publicKey != this.publicKey) {
      error('You are not the owner');
    }
    this.name = name;
  }
}`