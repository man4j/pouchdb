'use strict';

import { createError, MISSING_DOC } from '../../deps/errors';
import { DOC_STORE } from './util';

export default function(db, api, callback) {

  var txn = db.transaction([DOC_STORE], 'readwrite');
  var key = IDBKeyRange.only(0);
  var req = txn.objectStore(DOC_STORE).index('deletedOrLocal').count(key);

  req.onsuccess = function(e) {
    callback(null, {
      doc_count: e.target.result,
      update_seq: api.metaData.seq
    });
  };

}
