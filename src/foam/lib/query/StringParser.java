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
  private static ThreadLocal<StringBuilder> sb = new ThreadLocal<StringBuilder>(){};

  public StringParser() {
  }

  public PStream parse(PStream ps, ParserContext x) {

    if ( !ps.valid() )  return null;

    char delim = ' ';
    char lastc = delim;

    sb.set(new StringBuilder());

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
            sb.set(sb.get().append( escapePS.value()));
            tail = escapePS;
            c = ( (Character) escapePS.value() ).charValue();
          }
        }
      } else {
        sb.set(sb.get().append(c)); 
      }

      ps = tail;
      lastc = c;
    }

    return ps.tail().setValue(sb.get().toString());
  }
}