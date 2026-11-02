import { request, response } from 'express';
import AlbumConstant from './Album.constant.mjs';
import SendResponse from '../../../utils/SendResponse.mjs';
import StatusCodeConstant from '../../../constant/StatusCode.constant.mjs';
import AlbumService from './Album.service.mjs';
import Create_Album_Validator from './Album.validator.mjs';
import AlbumUtils from './Album.utils.mjs';
import {
  Delete_From_Cloudinary,
  uploadOnCloudinary,
} from '../../../utils/Cloudinary.mjs';

class Album_Controller {
  createAlbum = async (req = request, res = response) => {
    try {
      let { albumName, albumDescription } = req.body;
      let { filename } = req.file;

      if (!filename) {
        throw new Error(AlbumConstant.IMAGE_NOT_FOUND);
      }

      let Find_Album = await AlbumUtils.FindByAlbumName(albumName);

      if (Find_Album) {
        throw new Error(AlbumConstant.ALBUM_FOUND);
      }

      let Cloudinary = await uploadOnCloudinary(filename);

      if (!Cloudinary) {
        throw new Error(AlbumConstant.CLOUDINARY_ERROR);
      }

      let { error } = await Create_Album_Validator.validate({
        albumName: albumName,
        albumImageUrl: Cloudinary.url,
        albumDescription: albumDescription,
      });

      if (error) {
        throw new Error(error.details[0].message);
      }

      let createdAlbum = await AlbumService.create({
        albumName: albumName,
        albumDescription: albumDescription,
        Url: Cloudinary.url,
      });

      if (!createdAlbum) {
        throw new Error(AlbumConstant.ALBUM_NOT_CREATED);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.CREATED,
        AlbumConstant.ALBUM_CREATED,
        createdAlbum
      );
    } catch (error) {
      console.log(error);
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  };

  deleteAlbum = async (req = request, res = response) => {
    try {
      let { albumId } = req.params;

      let Find_Album = await AlbumUtils.FindByAlbumId(albumId);

      if (!Find_Album) {
        throw new Error(AlbumConstant.ALBUM_NOT_FOUND);
      }

      let Delete__Cloudinary_Image = await Delete_From_Cloudinary(
        Find_Album.aImage_url
      );

      if (!Delete__Cloudinary_Image.deleted) {
        throw new Error(AlbumConstant.NOT_DELETED);
      }

      let deletedAlbum = await AlbumService.delete(albumId);

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        AlbumConstant.DELETED,
        deletedAlbum
      );
    } catch (error) {
      console.log(error);
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  };

  getAlbum = async (req, res) => {
    try {
      let getAlbum = await AlbumUtils.findAll();

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        AlbumConstant.ALBUM_FOUND,
        getAlbum || []
      );
    } catch (error) {
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  };

  getAll_AlbumName = async (req, res) => {
    try {
      let getAlbum = await AlbumUtils.findAllAlbumName();

      if (getAlbum.length < 0) {
        throw new Error(AlbumConstant.ALBUM_NOT_FOUND);
      }

      SendResponse.success(
        res,
        StatusCodeConstant.SUCCESS,
        AlbumConstant.ALBUM_FOUND,
        getAlbum
      );
    } catch (error) {
      SendResponse.error(res, StatusCodeConstant.BAD_REQUEST, error.message);
    }
  };
}

export default new Album_Controller();
