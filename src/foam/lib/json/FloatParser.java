/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.lib.json;

import foam.lib.parse.*;

public class FloatParser implements Parser {
  private static ThreadLocal<StringBuilder> n = new ThreadLocal<StringBuilder>();
  public PStream parse(PStream ps, ParserContext x) {
    boolean decimalFound = false;
    n.set(new StringBuilder());

    if ( ! ps.valid() ) return null;

    char c = ps.head();

    if ( c == '-' ) {
      n.get().append(c);
      ps = ps.tail();
      if ( ! ps.valid() ) return null;
      c = ps.head();
    }

    // Float numbers must start with a digit: 0.1, 4.0
    if ( Character.isDigit(c) ) n.get().append(c);
    else return null;

    ps = ps.tail();

    while ( ps.valid() ) {
      c = ps.head();
      if ( Character.isDigit(c) ) {
          n.get().append(c);
      } else if ( c == '.' ) { // TODO: localization
        if ( decimalFound ) return null;
        decimalFound = true;
        n.get().append(c);
      } else {
        break;
      }
      ps = ps.tail();
    }

    return ps.setValue(n.get().length() > 0 ? Float.valueOf(n.get().toString()) : null);
  }
}
