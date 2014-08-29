TARGET=dist/win-i18n-regional-settings-addon.xpi

all: clean xpi

clean:
	rm -f $(TARGET)

xpi:
	zip $(TARGET) -xMakefile -xdist/\* *

