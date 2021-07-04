from matplotlib import pyplot as plt
from js import document

def create_root_element(self):
    print('my create_root_element!')
    div = document.getElementById('figure-div')
    return div

plt.figure()
f = plt.gcf()
#override create_root_element method of canvas by one of the functions above
f.canvas.create_root_element = create_root_element.__get__(f.canvas, f.canvas.__class__)

plt.plot([], [])
f.canvas.show()