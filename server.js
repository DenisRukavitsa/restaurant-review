const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const restaurantRoutes = require('./routes/restaurants');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// routes
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/reviews', reviewRoutes);

// fallback route
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// unhandled errors
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.mkrtt.mongodb.net/restaurants?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  console.log('Listening');
  app.listen(process.env.PORT || 3000);
});
