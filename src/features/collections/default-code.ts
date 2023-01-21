export const DEFAULT_CODE = (name: string) => `// This is an example collection definition.
// You should edit it for your use case.

// The language (Polylang) is similar to JavaScript,
// but semi-colons are mandatory.

// The \`collection\` keyword defines a named collection.
// Collection properties define the "columns" in a record.
collection ${name} {
  // \`id\` is unique and required on all collections
  id: string;

  // We will use a public key to authenticate function
  // calls later
  publicKey: string;

  // An optional property denoted with ?
  name?: string; 

  // \`constructor\` is called when a new record is
  // created, make sure to assign a value to \`this.id\`
  constructor (id: string) {
    // \`this.id\` must be assigned in the constructor
    // \`this.id\` must be unique in collection
    this.id = id;
    
    // You can assign the publicKey of the user who is
    // creating the record, this can then be used to
    // control permissions for the record (see below)
    this.publicKey = ctx.publicKey;
  }

  // You can add your own functions to determine rules
  // on who can update the records data
  function setName (name: string) {
    // Check if the caller is the original creator of the record.
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.name = name;
  }
}`