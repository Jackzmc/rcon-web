export interface Server {
  id: String,
  name: String
  ip: String
  port: Number,
  tags: String[],
  created: Date,
  directory: String
}
