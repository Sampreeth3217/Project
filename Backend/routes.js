const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Event } = require('./models');
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your_custom_secret_key';

// Middleware for token authentication
const authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// User Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password correctly with salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// User Login
router.post('/login',async (req, res) => {
  try {
    const usersCollection = req.app.get('users');
    const userCred = req.body;
    let user = await User.findOne({ username: userCred.username });
    // if user does not exist
    if (user == null) {
      res.send({ message: "Invalid Username" });
    } else {
      let result = await bcrypt.compare(userCred.password, user.password);
      // if password does not match
      if (result == false) {
        res.send({ message: "Invalid Password" });
      } else {
        // create JWT token with 20 seconds expiration
        let signedToken = jwt.sign({ username: userCred.username }, process.env.SECRET_KEY , { expiresIn: '2400h' });
        // send response
        res.send({ message: "Login Successful", payload: { user: user, token: signedToken } });
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Error during login", error });
    }
});

// Protected Route Example
router.get('/dashboard', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ message: 'Welcome to the dashboard', user });
});

// Create Event
router.post('/events/create', authenticate, async (req, res) => {
  const { name, date, description, organizer } = req.body;
  const event = new Event({ name, date, description, organizer });
  await event.save();
  res.status(201).json({ message: 'Event created successfully', event });
});

// Get All Events
router.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Get Event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: 'Invalid event ID' });
  }
});

// Update Event by ID
router.put('/events/:id', async (req, res) => {
  const { name, date, description, organizer } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { name, date, description, organizer },
      { new: true } // Return the updated document
    );
    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event updated successfully', updatedEvent });
  } catch (error) {
    res.status(400).json({ error: 'Invalid event ID' });
  }
});

// Delete Event by ID
router.delete('/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid event ID' });
  }
});

// Get All Users (Admin Protected)
router.get('/users', authenticate, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get User by ID
router.get('/users/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

// Update User by ID
router.put('/users/:id', authenticate, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

// Delete User by ID
router.delete('/users/:id', authenticate, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

module.exports = router;



// const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const { User, Event } = require('./models');
// const router = express.Router();

// // Middleware for token authentication
// const authenticate = async (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) return res.status(401).json({ error: 'Unauthorized' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user info to the request
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// // User Signup
// router.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(400).json({ error: 'Email already exists' });
//   }
// });

// // User Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   console.log("Login Attempt: ", email, password);

//   const user = await User.findOne({ email });
//   if (!user) {
//     console.log("User not found");
//     return res.status(404).json({ error: 'User not found' });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     console.log("Invalid password attempt");
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   res.json({ message: 'Login successful', token });
// });

// // Protected Route Example
// router.get('/dashboard', authenticate, async (req, res) => {
//   const user = await User.findById(req.user.id);
//   res.json({ message: 'Welcome to the dashboard', user });
// });

// // Event Routes
// router.post('/events/create', authenticate, async (req, res) => {
//   const { name, date, description, organizer } = req.body;
//   const event = new Event({ name, date, description, organizer });
//   await event.save();
//   res.status(201).json({ message: 'Event created successfully', event });
// });

// router.get('/events', async (req, res) => {
//   const events = await Event.find();
//   res.json(events);
// });

// router.get('/events/:id', async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ error: 'Event not found' });
//     res.json(event);
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid event ID' });
//   }
// });

// router.put('/events/:id', authenticate, async (req, res) => {
//   const { name, date, description, organizer } = req.body;
//   try {
//     const updatedEvent = await Event.findByIdAndUpdate(
//       req.params.id,
//       { name, date, description, organizer },
//       { new: true }
//     );
//     if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
//     res.json({ message: 'Event updated successfully', updatedEvent });
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid event ID' });
//   }
// });

// router.delete('/events/:id', authenticate, async (req, res) => {
//   try {
//     const deletedEvent = await Event.findByIdAndDelete(req.params.id);
//     if (!deletedEvent) return res.status(404).json({ error: 'Event not found' });
//     res.json({ message: 'Event deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid event ID' });
//   }
// });

// // User Routes
// router.get('/users', authenticate, async (req, res) => {
//   const users = await User.find();
//   res.json(users);
// });

// router.get('/users/:id', authenticate, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     res.json(user);
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid user ID' });
//   }
// });

// router.put('/users/:id', authenticate, async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       { name, email, password: hashedPassword },
//       { new: true }
//     );
//     if (!updatedUser) return res.status(404).json({ error: 'User not found' });
//     res.json({ message: 'User updated successfully', updatedUser });
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid user ID' });
//   }
// });

// router.delete('/users/:id', authenticate, async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     if (!deletedUser) return res.status(404).json({ error: 'User not found' });
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: 'Invalid user ID' });
//   }
// });

// module.exports = router;
