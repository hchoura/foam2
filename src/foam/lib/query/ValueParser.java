package foam.lib.query;

import foam.lib.parse.PStream;
import foam.lib.parse.Parser;
import foam.lib.parse.ParserContext;

public class ValueParser
  implements Parser {
  private static ThreadLocal<StringBuilder> s = new ThreadLocal<StringBuilder>();
  @Override
  public PStream parse(PStream ps, ParserContext x) {
    s.set(new StringBuilder());

    while ( ps.valid() ) {
      char c = ps.head();
      if ( c == ' ' ) break;
      ps = ps.tail();
      s.get().append(c);
    }

    return ps.setValue(new foam.mlang.Constant(s.get().toString()));
  }
}
