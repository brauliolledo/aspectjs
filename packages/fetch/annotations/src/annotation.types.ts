import { Delete } from './delete.annotation';
import { Get } from './get.annotation';
import { Patch } from './patch.annotation';
import { Post } from './post.annotation';
import { Put } from './put.annotation';

export type FetchAnnotationType = typeof Get | typeof Post | typeof Put | typeof Patch | typeof Delete;
