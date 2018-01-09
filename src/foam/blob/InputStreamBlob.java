package foam.blob;

import java.io.*;

public class InputStreamBlob
    extends AbstractBlob
    implements Closeable
{
  protected int size_;
  protected int pos_ = 0;
  protected InputStream in_;

  public InputStreamBlob(InputStream in, int size) {
    size_ = size;
    in_ = in;
  }

  @Override
  public int read(OutputStream out, int offset, int length) {
    try {
      if ( offset != pos_ ) {
        throw new RuntimeException("Offset does not match stream position");
      }

      byte[] buffer = new byte[length];
      int read = in_.read(buffer, 0, length);
      if ( read == -1 ) {
        throw new RuntimeException("Failed to read from input stream");
      }

      out.write(buffer, 0, length);
      out.flush();
      pos_ += read;
      return read;
    } catch (Throwable t) {
      return -1;
    }
  }

  @Override
  public int getSize() {
    return size_;
  }

  @Override
  public void close() throws IOException {
    in_.close();
  }
}