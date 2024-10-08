import { ExpenseModel, CommentModel } from "../models/expense.js";
import UserModel from "../models/user.js";
import mongoose from "mongoose";

export const createExpense = async (req, res) => {
  try {
    const { id: userId } = req.params;
    
    const { bankName, subHead, purpose, amount, total, status,TxnId } = req.body;
    
    const user = await UserModel.findOne({ _id: userId });
    //  if(user.role !== 'accountant')
    //  {
    //     return res.status(500).json({
    //         message:'user is not accountant'
    //     })
    //  }
    console.log(user);
    const newExpense = new ExpenseModel({
      bankName,
      subHead,
      purpose,
      amount,
      total,
      status,
      userId,
      TxnId
    });

    await newExpense.save();

    return res.status(201).json({
      message: "Expense created successfully",
      expense: newExpense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating expense",
      error: error.message,
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const { id: expenseId } = req.params;
    const { commentText } = req.body;
    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userRole = user.role;
    const userName = user.name;
    const newComment = {
      commentText,
      userRole,
      userId,
      userName,
      createdAt: Date.now(),
    };
    expense.comments.push(newComment);

    await expense.save();
    res.status(200).json({
      message: "Comment created successfully",
      comment: newComment,
      expenseComments: expense.comments,
    });
  } catch (error) {
    console.log("Error in creating comment: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id: expenseId } = req.params;
    const { status } = req.body;
    const updatedStatus = await ExpenseModel.updateOne(
      { _id: expenseId },
      { $set: { status: status } }
    );
    console.log("update status", updatedStatus);
    res.status(200).json({
      message: "status updated uccesfully",
      user: updatedStatus,
    });
  } catch (error) {
    console.log("error in updateStatus ", error.message);
  }
};

export const getExpense = async (req, res) => {
  try {
    const getExpense = await ExpenseModel.find();
    res.status(200).json({
      message: "expense get succesfulley",
      Expenses: getExpense,
    });
  } catch (error) {}
};
