'use strict';

import { DOC_STORE } from './util';

import traverseRevTree from '../../deps/merge/traverseRevTree';

export default function(idb, id, revs, callback) {

  var txn = idb.transaction([DOC_STORE], 'readwrite');

  txn.objectStore(DOC_STORE).get(id).onsuccess = function(e) {
    var doc = e.target.result;

    traverseRevTree(doc.rev_tree, function (isLeaf, pos, revHash, ctx, opts) {
      var rev = pos + '-' + revHash;
      if (revs.indexOf(rev) !== -1) {
        opts.status = 'missing';
      }
    });

    revs.forEach(function(rev) {
      if (rev in doc.revs) {
        delete doc.revs[rev];
      }
    });

    // TODO: orphaned attachments?
    txn.objectStore(DOC_STORE).put(doc);
  };

  txn.oncomplete = function() {
    callback();
  }
}
