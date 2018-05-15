/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.lib.json;

import foam.lib.parse.*;

public class StringParser implements Parser {
  public final static char ESCAPE = '\\';

  private static ThreadLocal<StringBuilder> sb = new ThreadLocal<StringBuilder>(){

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

  public StringParser() {
  }

  public PStream parse(PStream ps, ParserContext x) {
    char delim = ps.head();

    if ( delim != '"' && delim != '\'' ) return null;

    ps = ps.tail();
    char lastc = delim;

    StringBuilder builder = sb.get();

    while ( ps.valid() ) {
      char c = ps.head();

      if ( c == delim && lastc != ESCAPE ) break;

      PStream tail = ps.tail();

      if ( c == ESCAPE ) {
        char   nextChar        = ps.tail().head();
        Parser escapeSeqParser = null;

        if ( nextChar == 'u' ) {
          // TODO: make a constant
          escapeSeqParser = new UnicodeParser();
        } else if ( nextChar == 'n' ) {
          // TODO: make a constant
          escapeSeqParser = new ASCIIEscapeParser();
        }

        if ( escapeSeqParser != null ) {
          PStream escapePS = ps.apply(escapeSeqParser, x);
          if ( escapePS != null ) {
            builder.append(escapePS.value());
            tail = escapePS;

            c = ((Character) escapePS.value()).charValue();
          }
        }
      } else {
        builder.append(c);
      }

      ps = tail;
      lastc = c;
    }

    return ps.tail().setValue(builder.toString());
  }
}
