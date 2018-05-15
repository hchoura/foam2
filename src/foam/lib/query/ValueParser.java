package foam.lib.query;

import foam.lib.parse.PStream;
import foam.lib.parse.Parser;
import foam.lib.parse.ParserContext;

public class ValueParser
  implements Parser {
  private static ThreadLocal<StringBuilder> s = new ThreadLocal<StringBuilder>(){
    @Override
    protected StringBuilder initialValue() {
      return new StringBuilder();
    }

    @Override
    public StringBuilder get() {
      StringBuilder b = super.get();
      b.setLength(0);
      return b;
    }
  };
  @Override
  public PStream parse(PStream ps, ParserContext x) {
    StringBuilder builder = s.get();

    while ( ps.valid() ) {
      char c = ps.head();
      if ( c == ' ' ) break;
      ps = ps.tail();
      builder.append(c);
    }

    return ps.setValue(new foam.mlang.Constant(builder.toString()));
  }
}
