import Router from 'koa-router';
import ContentImgsModel from '../../models/contentImgs';
import multer from 'koa-multer';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import mkdirp from 'mkdirp';
import send from 'koa-send';

const upload = multer({ dest: path.join(process.cwd(), 'uploads/tmp/') });
const router = new Router();
const todayPath = moment().format('YYYY/MM/DD');
const rootPath = path.join(process.cwd(), 'uploads');
const todayStablePath = path.join(rootPath, todayPath);

router.get('/query', async (ctx, next) => {
  let groupId = parseInt(ctx.query.groupId, 10);
  if (isNaN(groupId)) {
    groupId = null;
  }
  const contentImgs = await ContentImgsModel.query(groupId);
  ctx.body = {
    status: 'query contentImgs',
    data: contentImgs
  }
});

router.get('/groupList', async (ctx, next) => {
  const groupList = await ContentImgsModel.groupList();
  ctx.body = {
    status: 'list contentImgs group',
    data: groupList
  }
});

router.post('/upload', upload.single('file'), async (ctx, next) => {
  const file = ctx.req.file;
  if (file) {
    const { groupId } = ctx.req.body;
    const src = fs.createReadStream(file.path);
    mkdirp.sync(todayStablePath);
    const stableFileName = `${file.filename}${path.extname(file.originalname)}`;
    const destPath = path.join(todayStablePath, stableFileName);
    const relativePath = path.join(todayPath, stableFileName);
    const uriPath = relativePath.replace(/\\/g, '/');
    const dest = fs.createWriteStream(destPath);
    src.pipe(dest);
    try {
      await new Promise((resolve, reject) => {
        src.on('end', () => { resolve() });
        src.on('error', (err) => { reject('move temp to stable accur error!', err) });
      });
      fs.unlinkSync(file.path);
      await ContentImgsModel.create(stableFileName, file.originalname, uriPath, groupId, file.mimetype);
      ctx.body = {
        success: true,
        message: 'upload success!',
        originalname: `${file.originalname}`,
        filename: `${stableFileName}`
      };
    } catch (error) {
      ctx.body = {
        success: false,
        message: error
      }
    }
  }
});

router.get('/getFile', async (ctx) => {
  const { id, file } = ctx.query;
  const opt = {
    root: rootPath
  }
  if (file) {
    await send(ctx, file, opt);
  } else if (id) {
    const [data] = await ContentImgsModel.getById(id);
    if (data) {
      await send(ctx, data.path, opt);
    } else {
      ctx.body = {
        success: false,
        message: '找不到对应的图片'
      }
    }
  } else {
    ctx.body = {
      success: false,
      message: '参数:file，不存在或者非法'
    }
  }
  // await send()
});

router.post('/delImgItem', async (ctx) => {
  const { id } = ctx.req.body;
  if (id) {
    const [file] = await ContentImgsModel.getById(id);
    if (file) {
      const stablePath = path.join(rootPath, file.path);
      if (stablePath !== rootPath && fs.existsSync(stablePath)) {
        await fs.unlinkSync(stablePath);
      }
      await ContentImgsModel.delete(id);
      ctx.body = {
        success: true,
        message: '删除成功'
      }
    } else {
      ctx.body = {
        success: true,
        message: '文件不存在，无操作'
      }
    }
  } else {
    ctx.body = {
      success: false,
      message: '参数:id，不存在或者非法'
    }
  }
});

router.post('/changeFileName', async (ctx) => {
  const { id, name } = ctx.req.body;
  if (id) {
    await ContentImgsModel.changeOriginName(id, name);
    ctx.body = {
      success: true,
      message: 'ok'
    }
  } else {
    ctx.body = {
      success: false,
      message: 'error'
    }
  }
});

router.post('/changeGroup', async (ctx) => {
  const { ids, groupId } = ctx.req.body;
  if (ids && groupId) {
    await ContentImgsModel.changeGroup(ids, groupId);
    ctx.body = {
      success: true,
      message: 'ok'
    }
  } else {
    ctx.body = {
      success: false,
      message: 'error'
    }
  }
});

export default router;
