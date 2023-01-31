#Ce script permet de convertir les points de fixation dans la scène 3D en coordonnée par rapport à la carte afficher à l 'écran 


import os
import pandas as pd
import matplotlib.pyplot as plt
import csv
import datetime
import json

# resultat_carte.cvs est produit par l'enquête
# fixations_on_surface_Surface est produit par l'acquisition avec l'ET, il est dans export/surface
# info.player.json est dans le dossier produit par l'acquisition (il permet de calculer le temps réel)


# attention de changer les chemins d'accès
f = open('recordings/info.player.json',)
json_time = json.load(f)


start_time_system = float(json_time["start_time_system_s"]) # System Time at recording start
start_time_synced = float(json_time["start_time_synced_s"])# Pupil Time at recording start
# Calculate the fixed offset between System and Pupil Time
offset = start_time_system - start_time_synced


path_to_export = "recordings"
path_to_enquete = "resultat_enquete"
path_to_fixation = os.path.join(path_to_export, "fixations_on_surface_Surface.csv")
path_to_resultat= os.path.join(path_to_export, "resultat_carte.csv")

assert os.path.exists(path_to_fixation)
fixation = pd.read_csv(path_to_fixation)

assert os.path.exists(path_to_resultat)
resultat = pd.read_csv(path_to_resultat)

coord_fixation =[]

box_carte = [8/1280,(960-(720+153))/960,(1080+8)/1280,(720-140)/960] # a calculer en pourcentage (xmin,ymin,xmax,ymax)


time_repetition = [[],[],[],[]]
n_iteration = 1

time_repetition[0].append([resultat["time"][0],resultat["etape"][0],resultat["n_iteration"][0]])
#on récupérer le temps de changement d'étape 
for k in range(len(resultat)):
    if  resultat["n_iteration"][k] != n_iteration:
        time_repetition[resultat["etape"][k]-1].append([resultat["time"][k],resultat["etape"][k],resultat["n_iteration"][k]])
        n_iteration = resultat["n_iteration"][k] 


print(time_repetition)
temps_etape = []
for k in range(len(time_repetition)):
    temps_etape.append(time_repetition[k][1][0] - time_repetition[k][0][0])

#récupération de l'état de la carte au temps timestamp 
def box_coord(timestamp):
    box = [0,0,0,0]
    zoom = 0
    etape = 1
    n_iteration = 0
    repetition = 0
    rotation = 0
    time_fix = 0
    for t in range(len(resultat)):
        if (timestamp+offset)*1000 >= resultat["time"][t]:
            time_fix = resultat["time"][t]
            zoom = resultat["zoom"][t]
            etape = resultat["etape"][t]
            box = [float(resultat["xmin"][t]),float(resultat["ymin"][t]),float(resultat["xmax"][t]),float(resultat["ymax"][t])]
            n_iteration = resultat["n_iteration"][t]
            repetition = resultat["repetition"][t]
            rotation = resultat["rotation"][t]
            continue
        else:
            break
    return box,zoom,etape,n_iteration,repetition,rotation,time_fix


for k in range(len(fixation)):
    id = fixation["fixation_id"][k]
    stop_it = False
    if int(fixation["world_index"][k]) > 10: # on enleve les points de debut lors du lancement de l'acquisition 
    #on prend en compte les points qui sont positionnée sur la carte 
        if float(fixation["norm_pos_x"][k]) > box_carte[0] and float(fixation["norm_pos_x"][k]) < box_carte[2]:   
            if float(fixation["norm_pos_y"][k]) > box_carte[1] and float(fixation["norm_pos_y"][k]) < box_carte[3]:

                box_coordinate,zoom,etape,n_iteration,repetition,rotation,time_fix = box_coord(fixation["world_timestamp"][k])
                
                if(n_iteration == time_repetition[etape-1][-1][2] and time_fix > time_repetition[etape-1][-1][0]+2000+temps_etape[etape-1] ):
                    stop_it = True

                 # on calcul la position relative du point dans la carte
                if(rotation == False):
                    x_relatif = (float(fixation["norm_pos_x"][k])-box_carte[0])/(box_carte[2]-box_carte[0])
                    y_relatif = (float(fixation["norm_pos_y"][k])-box_carte[1])/(box_carte[3]-box_carte[1])
                    x_coord = box_coordinate[0] + x_relatif*(box_coordinate[2]-box_coordinate[0] )
                    y_coord = box_coordinate[1] + y_relatif*(box_coordinate[3]-box_coordinate[1] )
                    coord_fixation.append([id,x_coord,y_coord,zoom,etape,n_iteration,repetition,rotation,stop_it])
                else:
                    x_relatif = (float(fixation["norm_pos_x"][k])-box_carte[0])/(box_carte[2]-box_carte[0])
                    y_relatif = (float(fixation["norm_pos_y"][k])-box_carte[1])/(box_carte[3]-box_carte[1])
                    x_coord = box_coordinate[0] + (1-x_relatif)*(box_coordinate[2]-box_coordinate[0])
                    y_coord = box_coordinate[1] + (1-y_relatif)*(box_coordinate[3]-box_coordinate[1])
                    coord_fixation.append([id,x_coord,y_coord,zoom,etape,n_iteration,repetition,rotation,stop_it])


with open('resultat_enquete/coord_fixation_on_map_margaux.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["id_fixation","x","y","zoom","etape","n_iteration","repetition","rotation","stop_iteration"]) # rajouter le zoom
    for i in range(len(coord_fixation)):
        writer.writerow(coord_fixation[i])
