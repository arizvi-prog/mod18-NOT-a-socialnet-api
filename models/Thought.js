const mongoose = require('mongoose');
const { Schema } = mongoose;
const ReactionSchema = require('./Reaction').schema;

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => createdAtVal.toISOString()
    },
    username: {
        type: String,
        required: true
    },
    reactions: [ReactionSchema]
});

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

module.exports = mongoose.model('Thought', ThoughtSchema);
