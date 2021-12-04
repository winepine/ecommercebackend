const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // for hashing the password so that we can match them later
//fields of customers
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 5,
      max: 15,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 5,
      max: 15,
    },
    cnic: {
      type: String,
      //   required: false,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    hashed_password: {
      type: String,
      required:true,
     //  default: " "
    },
    contactNumber: {
      type: String,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
  },
  { timestamps: true }
); //mongoose adds created at and updated at properties to your schema

/*userSchema.virtual('password').set(function (password) {
  this.hashed_password=password;
});
*/
userSchema.virtual("password").get(function() { return this._password}).set(async function (password) {

  this._password = password;
  console.log("setting:", password);
  this.hashed_password=bcrypt.hashSync(this._password, 10);
  // const salt= await bcrypt.genSalt(10, async function(err,salt){

  // this.hashed_password= await bcrypt.hash(password, salt);
  // })
  // //console.log(this.hashed_password);
  // next();
})
userSchema.pre('save', async function(next){
  var self = this;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(self.password, salt, function(err, hash) {
       console.log("WE HAVE A HASH:"+hash);
        self.password=hash;
       // Store hash in your password DB.
    });
  });
// const salt= await bcrypt.genSalt(10,function(err,salt){
//   if (err) 
//     return callback(err);

//   bcrypt.hash(password, salt, function(err, hash) {
//     return callback(err, hash);
//   });
// });
// this.password=await bcrypt.hash(this.password, salt);
next();
})

userSchema.methods = {
 
  authenticate: function(candidatePassword) {
    const result =  bcrypt.compareSync(candidatePassword, this.hashed_password);
    return result ;
  },
  changePass:function(pass){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(pass, salt, function(err, hash) {
         console.log("WE HAVE A HASH:"+hash);
          return hash;
         // Store hash in your password DB.
      });
    });
  }
}

/*async function hashIt(password){
  //userSchema.virtual("password").set(function (password) {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
 // }
}

userSchema.virtual('password').set(function (password) {
  this.hashed_password=password;
  hashIt(this.hashed_password);
  console.log(this.hashed_password);
});



async function compareIt(password){
  //password=this.hashed_password;
  const validPassword = await bcrypt.compare(password, this.hashed_password);
  console.log(this.hashed_password)
  if (!validPassword) {
    // authentication failed
    console.log(password);
    console.log(this.hashed_password);
    return false;
} else {
    // authentication successful
    console.log(password);
    console.log(this.hashed_password);
    return true;
}
  //return bcrypt.compareSync(password, this.hash_password);

}



userSchema.methods = {
  authenticate: function(password){
    compareIt(password);
  }
  /*authenticate: function(candidatePassword) {
     bcrypt.compareSync(candidatePassword, this.password, function(err, isMatch) {
          if (err) 
         console.log(err);
          return(true);
      });
  }
  */
//}

/*
userSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);
          // override the cleartext password with the hashed one
          user.password = hash;
          console.log(user.password);
          next();
      });
  });
});
   
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

/*
userSchema.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
  console.log(password);
});
userSchema.methods = {

  authenticate: function (password) {

    if (!bcrypt.compareSync(password, this.hashed_password)) {
      // authentication failed
      console.log(password);
      console.log(this.hashed_password);
      return false;
  } else {
      // authentication successful
      return true;
  }
    //return bcrypt.compareSync(password, this.hash_password);
  },
};
*/
/*
//generating hash value:
userSchema.virtual('password').set(function(password){
    this._password=password;
    console.log(this._password);
});

//comparing user password and hash
userSchema.pre("save", function (next) {
    // store reference
    const user = this;
    if (user._password === undefined) {
        return next();
    }
    bcrypt.genSaltSync(10, function (err, salt) {
        if (err) console.log(err);
        // hash the password using our new salt
        bcrypt.hash(user._password, salt, function (err, hash) {
            if (err) console.log(err);
            user.hashed_password = hash;
            console.log(hashed_password);
            next();
        });
    });
});

//comparision k liye object=comparePassword:
userSchema.methods = {
    authenticate: function(candidatePassword) {
       bcrypt.compareSync(candidatePassword, this.password, function(err, isMatch) {
            if (err) 
           console.log(err);
            return(true);
        });
    }
}

*/
//we are writing a model=schema
module.exports = mongoose.model("User", userSchema);
