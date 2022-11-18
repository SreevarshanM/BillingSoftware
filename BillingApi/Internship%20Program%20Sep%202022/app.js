const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const models = require(`./models`);
const authRouter = require('./Routes/AuthRoutes');
const adminRouter = require('./Routes/AdminRoutes');
const app = express();
app.use(cors());
app.use(express.json());

//DB CONNECTION

mongoose
  .connect(
    'mongodb+srv://sreevarshan:abishega@cluster0.pvmlmxi.mongodb.net/BillingApplication?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then((con) => {
    console.log('DB Connection sucessfully');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api', authRouter);
app.use('/api', adminRouter);

////////////////////////////////////////////////////////////////////////////

const port = 4000;
app.listen(port, () => {
  console.log('App Running on Port 3000');
});
