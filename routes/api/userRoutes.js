const router = require('express').Router();
const User = require('../../models/User');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('thoughts').populate('friends');
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a single user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST a new user
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// PUT to update a user by id
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a user by id
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id' });
        }
        // Remove associated thoughts if BONUS
        await Thought.deleteMany({ username: user.username });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST to add a friend
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { $addToSet: { friends: req.params.friendId } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a friend
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
