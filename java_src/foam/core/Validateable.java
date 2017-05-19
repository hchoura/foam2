/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.core;

import java.lang.IllegalStateException;

public interface Validateable {
  public void validate() throws IllegalStateException;
}
