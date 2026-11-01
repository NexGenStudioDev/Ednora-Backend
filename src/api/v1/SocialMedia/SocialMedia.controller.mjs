import mongoose from 'mongoose';
import SocialMedia from './SocialMedia.model.mjs';

const defaultLinks = {
  linkedin: 'https://linkedin.com/school/eduvanta',
  facebook: 'https://facebook.com/eduvanta',
  instagram: 'https://instagram.com/eduvanta',
  email: 'info@eduvanta.edu',
  number: 9876543210,
};

const SocialMediaController = {
  async getLinks(req, res) {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(200).json({
          message: 'Got the Social Media Link',
          success: true,
          link: defaultLinks,
        });
      }

      const link = await SocialMedia.findOne();
      return res.status(200).json({
        message: 'Got the Social Media Link',
        success: true,
        link: link || defaultLinks,
      });
    } catch {
      return res.status(200).json({
        message: 'Got the Social Media Link',
        success: true,
        link: defaultLinks,
      });
    }
  },

  async updateLinks(req, res) {
    try {
      const {
        linkedin,
        facebook,
        instagram,
        email,
        number,
        Number: num,
      } = req.body;
      const phoneNum = number || num;
      let existing = await SocialMedia.findOne();
      if (!existing) {
        existing = await SocialMedia.create({
          linkedin,
          facebook,
          instagram,
          email,
          number: phoneNum,
        });
      } else {
        if (linkedin !== undefined) existing.linkedin = linkedin;
        if (facebook !== undefined) existing.facebook = facebook;
        if (instagram !== undefined) existing.instagram = instagram;
        if (email !== undefined) existing.email = email;
        if (phoneNum !== undefined) existing.number = phoneNum;
        await existing.save();
      }
      return res.status(200).json({
        message: 'Social links updated successfully',
        success: true,
        link: existing,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || 'Failed to update social links',
        error: true,
      });
    }
  },
};

export default SocialMediaController;
