const { User, Thought } = require('../models')

const userController = {
  // get all users
  async getAllUser (req, res) {
    try {
      let dbUserData = await User.find({})
        .populate({
          path: 'friends',
          select: '-__v'
        })
        .select('-__v')
        .sort({ _id: 1 })
      res.json(dbUserData)
    } catch (err) {
      console.log(err)
      res.sendStatus(400)
    }
  },

  // get one user by id
  async getUserById ({ params }, res) {
    try {
      let dbUserData = await User.findOne({ _id: params.id })
        .populate({
          path: 'thoughts',
          select: '-__v'
        })
        .populate({
          path: 'friends',
          select: '-__v'
        })
        .select('-__v')
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: 'No user found with id: ' + params.id })
      }
      res.json(dbUserData)
    } catch (err) {
      console.log(err)
      res.sendStatus(400)
    }
  },

  // create a user
  async createUser ({ body }, res) {
    try {
      let dbUserData = await User.create(body)
      res.json(dbUserData)
    } catch (err) {
      res.json(err)
    }
  },

  // update a user
  async updateUser ({ params, body }, res) {
    try {
      let dbUserData = await User.findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true
      })
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: 'No user found with id: ' + params.id })
      }
      res.json(dbUserData)
    } catch (err) {
      res.json(err)
    }
  },

  // delete a user
  async deleteUser ({ params }, res) {
    try {
      let dbUserData = await User.findOneAndDelete({ _id: params.id })
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: 'No user with id: ' + params.id })
      }
      Thought.deleteMany({ _id: { $in: dbUserData.thoughts } })
      res.json({ message: 'Deleted user along with thoughts.' })
    } catch (err) {
      res.json(err)
    }
  },

  // adding a friend
  async addFriend ({ params }, res) {
    try {
      let dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $addToSet: { friends: params.friendId } },
        { new: true, runValidators: true }
      )
      if (!dbUserData) {
        res
          .status(404)
          .json({ message: 'Cant find user with id: ' + params.userId })
        return
      }
      res.json(dbUserData)
    } catch (err) {
      res.json(err)
    }
  },

  //remove a friend
  async removeFriend ({ params }, res) {
    try {
      let dbUserData = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      )
      if (!dbUserData) {
        return res
          .status(404)
          .json({ message: 'No user with id: ' + params.userId })
      }
      res.json(dbUserData)
    } catch (err) {
      res.json(err)
    }
  }
};

module.exports = userController;
