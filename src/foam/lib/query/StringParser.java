/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.lib.query;

import foam.lib.json.ASCIIEscapeParser;
import foam.lib.json.UnicodeParser;
import foam.lib.parse.PStream;
import foam.lib.parse.Parser;
import foam.lib.parse.ParserContext;

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

    if ( !ps.valid() )  return null;

    char delim = ' ';
    char lastc = delim;

    StringBuilder builder = sb.get();

    PStream lastPs=null;

    while ( ps.valid() ) {
      char c = ps.head();

      if ( c == '=' || c == '<' || c == '>' || c == '-' || c == ':' || c == ',' || c == ' ' || c == ')' ) {
        ps=lastPs;
        break;
      }
      
      if ( c == delim && lastc != ESCAPE ) break;
      
      lastPs=ps;
      PStream tail = ps.tail();

      if ( c == ESCAPE ) {
        char nextChar = ps.tail().head();
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
            c = ( (Character) escapePS.value() ).charValue();
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