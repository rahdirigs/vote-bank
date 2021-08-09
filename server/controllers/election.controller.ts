import expressAsyncHandler from 'express-async-handler';
import { Election } from '../models/elections/election.model';

/**
 * POST /api/elections
 * @desc: Start a new election
 * @access: protected, admin
 */
export const startElection = expressAsyncHandler(async (req, res) => {
  const { owner, title, description } = req.body;
  const electionExists = await Election.findOne({ title });
  if (electionExists) {
    res.status(400);
    throw new Error('Election with the same title already exists...');
  }
  const election = await Election.create({ owner, title, description });
  if (election) {
    res.status(201).json({
      _id: election._id,
      owner: election.owner,
      title: election.title,
      description: election.description,
      ongoing: election.ongoing,
    });
  } else {
    res.status(400);
    throw new Error('Invalid election data...');
  }
});

/**
 * GET /api/elections
 * @desc: List all elections on the network
 * @access: protected
 */
export const getElections = expressAsyncHandler(async (req, res) => {
  const elections = await Election.find({});
  res.json(elections);
});

/**
 * GET /api/elections/:id
 * @desc: Get Details of a particular election
 * @access: protected
 */
export const getElectionById = expressAsyncHandler(async (req, res) => {
  const election = await Election.findById(req.params.id);
  if (election) {
    res.json(election);
  } else {
    res.status(404);
    throw new Error('Election not found...');
  }
});

/**
 * PUT /api/elections/:id
 * @desc: End an election
 * @access: protected, admin
 */
export const stopElection = expressAsyncHandler(async (req, res) => {
  const election = await Election.findById(req.params.id);
  console.log(election);
  if (election) {
    election.ongoing = false;
    const updatedElection = await election.save();
    res.json({
      _id: updatedElection._id,
      owner: updatedElection.owner,
      title: updatedElection.title,
      description: updatedElection.description,
      ongoing: updatedElection.ongoing,
    });
  } else {
    res.status(404);
    throw new Error('Election not found...');
  }
});
