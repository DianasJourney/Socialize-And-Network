const { Thought, User } = require('../models')

const thoughtController = {
  // get all Thoughts
  async getAllThought (req, res) {
    try {
      let dbThoughtData = await Thought.find({})
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .sort({ _id: 1 })
      res.json(dbThoughtData)
    } catch (err) {
      console.log(err)
      res.sendStatus(400)
    }
  },

  // get one Thought by id
  async getThoughtById ({ params }, res) {
    try {
      let dbThoughtData = await Thought.findOne({ _id: params.id })
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought with id: ' + params.id })
      }
      res.json(dbThoughtData)
    } catch (err) {
      console.log(err)
      res.sendStatus(400)
    }
  },

  // create Thought
  async createThought ({ body }, res) {
    try {
      let _id = await Thought.create(body)
      User.findOneAndUpdate(
        { _id: body.userId },
        { $push: { thoughts: _id } },
        { new: true }
      )
      res.json({ message: 'Thought created!' })
    } catch (err) {
      res.json(err)
    }
  },

  // update Thought by id
  async updateThought ({ params, body }, res) {
    try {
      let dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        {
          new: true,
          runValidators: true
        }
      )
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought found with this id: ' + params.id })
      }
      res.json(dbThoughtData)
    } catch (err) {
      res.json(err)
    }
  },

  // delete Thought
  async deleteThought ({ params }, res) {
    try {
      let dbThoughtData = await Thought.findOneAndDelete({ _id: params.id })
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought with this id: ' + params.id })
      }
      User.findOneAndUpdate(
        { thoughts: params.id },
        { $pull: { thoughts: params.id } },
        { new: true }
      )
      res.json({ message: 'Deleted thought.' })
    } catch (err) {
      res.json(err)
    }
  },

  // add reaction
  async addReaction ({ params, body }, res) {
    try {
      let dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
      )
      if (!dbThoughtData) {
        return res
          .status(404)
          .json({ message: 'No thought with id: ' + params.thoughtId })
      }
      res.json(dbThoughtData)
    } catch (err) {
      res.json(err)
    }
  },

  // delete reaction
  async removeReaction ({ params }, res) {
    try {
      let dbThoughtData = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      )
      res.json(dbThoughtData)
    } catch (err) {
      res.json(err)
    }
  }
}

module.exports = thoughtController
