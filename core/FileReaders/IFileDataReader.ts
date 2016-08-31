interface IFileDataReader {
  readFile() : Promise<string[]>;
}

export default IFileDataReader;

