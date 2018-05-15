/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.lib.json;

import foam.lib.parse.*;

public class FloatParser implements Parser {
  private static ThreadLocal<StringBuilder> n = new ThreadLocal<StringBuilder>(){
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
  public PStream parse(PStream ps, ParserContext x) {
    boolean decimalFound = false;
    StringBuilder builder = n.get();

    if ( ! ps.valid() ) return null;

    char c = ps.head();

    if ( c == '-' ) {
      builder.append(c);
      ps = ps.tail();
      if ( ! ps.valid() ) return null;
      c = ps.head();
    }

    // Float numbers must start with a digit: 0.1, 4.0
    if ( Character.isDigit(c) ) builder.append(c);
    else return null;

    ps = ps.tail();

    while ( ps.valid() ) {
      c = ps.head();
      if ( Character.isDigit(c) ) {
        builder.append(c);
      } else if ( c == '.' ) { // TODO: localization
        if ( decimalFound ) return null;
        decimalFound = true;
        builder.append(c);
      } else {
        break;
      }
      ps = ps.tail();
    }

    return ps.setValue(builder.length() > 0 ? Float.valueOf(builder.toString()) : null);
  }
}
