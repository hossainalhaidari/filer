import os, zipfile, math, time, base64

class Files:

	def __init__(self, user):
		self.user = user

	def getPath(self, file):
		return os.path.join('/home/'+self.user.username, file)

	def getSize(self, file):
		size_bytes = os.path.getsize(file)

		if (size_bytes == 0):
			return '0B'

		size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
		i = int(math.floor(math.log(size_bytes, 1024)))
		p = math.pow(1024, i)
		s = round(size_bytes / p, 2)

		return '%s %s' % (s, size_name[i])

	def list(self, dir):
		data = []
		dir = self.getPath(dir)
		files = sorted(os.listdir(dir))

		for folder in files:
			fullpath = os.path.join(dir, folder)
			if os.path.isfile(fullpath) or (folder != ".." and folder.startswith(".")):
				continue
			
			type = 'Folder'
			size = self.getSize(fullpath)
			mtime = time.ctime(os.path.getmtime(fullpath))
			data.append({'name': folder, 'type': type, 'path': fullpath, 'size': size, 'mtime': mtime})

		for file in files:
			fullpath = os.path.join(dir, file)
			if os.path.isfile(fullpath) == False or file.startswith("."):
				continue
			
			type = 'File'
			size = self.getSize(fullpath)
			mtime = time.ctime(os.path.getmtime(fullpath))
			data.append({'name': file, 'type': type, 'path': fullpath, 'size': size, 'mtime': mtime})

		return data

	def parent(self, file):
		return os.path.abspath(os.path.join(file, os.pardir))

	def newfile(self, path):
		path = base64.b64decode(path)
		open(path, 'w+')

	def newdir(self, path):
		path = base64.b64decode(path)
		if not os.path.exists(path):
			os.makedirs(path)

	def zip(self, files, dest):
		zipf = zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED)
		for file in files:
			zip.write(file)
		zipf.close()

	def unzip(self, file, dir):
		file = base64.b64decode(file)
		zip_ref = zipfile.ZipFile(file, 'r')
		zip_ref.extractall(dir)
		zip_ref.close()
