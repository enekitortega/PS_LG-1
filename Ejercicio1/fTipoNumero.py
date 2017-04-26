'''FUNCION QUE DEVUELVE UNA LISTA DE LISTA
CADA LISTA CONTIENE LOS SIGUIENTES VALORES CON ESE ORDEN:
1 NUMERO PROCESADO
2 TIPO DE NUMERO
3 LISTA DE LOS DIVISORES PROPIOS
4 SUMA DE LOS DIVISORES PROPIOS
'''
def fPerfetoAbundateDefectivo(listaNumeros):
	#Lista para devolver toda la informacion
	lista=[]
	
	#Recorremos la lista de los numeros para ir analizando uno a uno 
	for num in listaNumeros:
		
		#Obtengo la lista de los divisores de los numeros de la lista
		listaDivisores=[divisores for divisores in range(1,num) if num%divisores==0]
		
		#variable para sumar los divisores y texto del tipo de numero
		sumaDivisores=0
		tipoNumero=""
		
		#Recorro la lista de los divisores para sumarlos
		for divisor in listaDivisores:
			sumaDivisores += divisor
		
		
		
		'''Se compara el numero de la lista con la suma de sus divisores
		para indicar de que tipo de numero es: PERFECTO, ABUNDANTE, DEFECTIVO '''
		if sumaDivisores == num:
			tipoNumero='PERFECTO'
		elif sumaDivisores > num:
			tipoNumero='ABUNDANTE'
		else:
			tipoNumero='DEFECTIVO'
		
		lista.append([num,tipoNumero,listaDivisores,sumaDivisores])
	
	return lista