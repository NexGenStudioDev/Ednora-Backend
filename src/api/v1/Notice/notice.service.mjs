import Notice from './notice.model.mjs';
import { Delete_From_Cloudinary } from '../../../utils/Cloudinary.mjs';

class Notice_Service {
  create_Notice = async (data) => {
    const { title, content, doc_link, type, target, priority } = data;
    const Created_Notice = await Notice.create({
      title,
      content,
      doc_link: doc_link || null,
      type: type || 'General',
      ...(target ? { target } : {}),
      ...(priority ? { priority } : {}),
    });

    if (!Created_Notice) {
      throw new Error('Failed to create notice');
    }

    return Created_Notice;
  };

  delete_Notice = async (id) => {
    const notice = await Notice.findById(id);
    if (!notice) {
      throw new Error('Notice not found or already deleted');
    }

    if (notice.doc_link) {
      try {
        await Delete_From_Cloudinary(notice.doc_link);
      } catch (err) {
        console.warn('[Notice] Error deleting Cloudinary doc:', err.message);
      }
    }

    await Notice.findByIdAndDelete(id);
    return notice;
  };

  get_Notice_By_Id = async (id) => {
    return await Notice.findById(id);
  };
}

export default new Notice_Service();
