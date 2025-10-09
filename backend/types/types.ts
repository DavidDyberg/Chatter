export interface CloudinaryFile extends Express.Multer.File {
  path: string;
  filename: string;
  public_id?: string;
}
