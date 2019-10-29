; function uploader(file, options) {
    this.file = file;
    this.options = $.extend({
        blockSize: 10,
        url: '/upload',
        error: null,
        success: null,
        progress: null
    }, options);

    if (typeof this.init !== 'function') {
        uploader.prototype.init = function () {
            if (typeof this.file.files[0] === 'undefined') {
                this.handleError({
                    message: '请选择要上传的文件'
                });

                return false;
            }

            return true;
        }

        uploader.prototype.handleError = function (data) {
            if (typeof this.options.error === 'function') {
                this.options.error(data);
            }
        }

        uploader.prototype.handleSuccess = function (data) {
            if (typeof this.options.success === 'function') {
                this.options.success(data);
            }
        }

        uploader.prototype.handleProgress = function (data) {
            if (typeof this.options.progress === 'function') {
                this.options.progress(data);
            }
        }

        uploader.prototype.postBlock = function (file, sum, fileSize, blockSize, blockCount, index, start, end) {
            var self = this;

            return function () {
                var deferred = $.Deferred(),
                    fd = new FormData();

                fd.append('data', file.slice(start, end));
                fd.append('name', file.name);
                fd.append('sum', sum);
                fd.append('count', blockCount);
                fd.append('index', index);

                $.ajax({
                    url: self.options.url,
                    type: 'POST',
                    data: fd,
                    async: true,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    xhr: function () {
                        var xhr = $.ajaxSettings.xhr();
                        xhr.upload.onprogress = function (e) {
                            var currentBlockSize = (index + 1 == blockCount || fileSize % blockSize == 0) ? fileSize % blockSize : blockSize;
                            var percent = (parseFloat(index * blockSize / fileSize) + parseFloat(parseFloat(e.loaded / e.total) * currentBlockSize) / fileSize).toFixed(6);

                            self.handleProgress({
                                percent: percent * 100
                            });
                        };

                        return xhr;
                    }
                }).done(function (data) {
                    if (typeof data.status === 'number' && data.status == 0) {
                        if (data.message) {
                            self.handleProgress({
                                percent: 100
                            });

                            self.handleSuccess({
                                name: data.name,
                                key: data.key,
                                message: '文件上传完成'
                            });
                        }
                        deferred.resolve();
                    } else {
                        self.handleError({
                            message: data.message
                        });

                        deferred.reject();
                    }
                }).fail(function () {
                    self.handleError({
                        message: '文件上传错误'
                    });

                    deferred.reject();
                });

                return deferred.promise();
            }
        }

        uploader.prototype.post = function () {
            var self = this,
                file = this.file.files[0],
                blockSize = 1024 * 1024 * this.options.blockSize,
                blockCount = Math.ceil(file.size / blockSize),
                sum = (new Date()).getTime() + '-' + Math.floor(Math.random() * file.size),
                promise = $.Deferred().resolve();

            for (var i = 0; i < blockCount; i++) {
                var start = blockSize * i,
                    end = Math.min(file.size, start + blockSize);

                promise = promise.then(self.postBlock(file, sum, file.size, blockSize, blockCount, i, start, end));
            }
        }

        uploader.prototype.start = function () {
            if (true === this.init()) {
                this.post();
            }
        }
    }
}
