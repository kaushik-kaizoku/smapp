const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads'; 
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); 
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

const createUser = async (req, res) => {
  try {

    console.log("Body:", req.body);
    console.log("Files:", req.files);

    if (!req.body.name || !req.body.socialHandle) {
      return res.status(400).json({ error: "Name and socialHandle are required." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required." });
    }


    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);


    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        socialHandle: req.body.socialHandle,
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
      include: {
        images: true, 
      },
    });

    console.log("User with images created:", newUser);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user with images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const fetchUsers = async (req, res) => {
  try {
    const usersWithImages = await prisma.user.findMany({
      include: {
        images: true,
      },
    });


    const formattedUsers = usersWithImages.map((user) => ({
      name: user.name,
      socialHandle: user.socialHandle,
      images: user.images.map((image) => ({
        url: image.url,
      })),
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error("Error fetching users with images:", error);
    return res.status(403).json({ error: "Fetching users failed" });
  }
};


module.exports = {
    createUser,
    fetchUsers
}